use std::sync::Mutex;
use tiny_http::{Server, Response, Header, Method, StatusCode};
use lazy_static::lazy_static;
use serde::{Serialize, Deserialize};
use std::fs;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CapturedCredential {
    pub title: String,
    pub username: String,
    pub password: String,
    pub url: String,
}

lazy_static! {
    pub static ref PENDING_CREDENTIALS: Mutex<Vec<CapturedCredential>> = Mutex::new(Vec::new());
}

fn get_cache_path() -> std::path::PathBuf {
    let mut path = std::env::temp_dir();
    path.push("zanpakuto_cache.json");
    path
}

pub fn start_ipc_server() {
    std::thread::spawn(move || {
        let server = match Server::http("127.0.0.1:14250") {
            Ok(s) => s,
            Err(_) => return,
        };

        for mut request in server.incoming_requests() {
            let url = request.url();
            let method = request.method();

            let cors_headers = vec![
                Header::from_bytes(&b"Access-Control-Allow-Origin"[..], &b"*"[..]).unwrap(),
                Header::from_bytes(&b"Access-Control-Allow-Headers"[..], &b"Content-Type"[..]).unwrap(),
                Header::from_bytes(&b"Access-Control-Allow-Methods"[..], &b"GET, POST, OPTIONS"[..]).unwrap(),
            ];

            if method == &Method::Options {
                let mut response = Response::empty(200);
                for h in &cors_headers { response = response.with_header(h.clone()); }
                let _ = request.respond(response);
                continue;
            }

            // GET entries from persistent cache file
            if url.starts_with("/api/get") {
                let path = get_cache_path();
                let json = fs::read_to_string(path).unwrap_or_else(|_| "[]".to_string());
                let mut res = Response::from_string(json)
                    .with_header(Header::from_bytes(&b"Content-Type"[..], &b"application/json"[..]).unwrap());
                for h in &cors_headers { res = res.with_header(h.clone()); }
                let _ = request.respond(res);
            } 
            // POST to save incoming credentials
            else if url.starts_with("/api/save") && method == &Method::Post {
                let mut content = String::new();
                if request.as_reader().read_to_string(&mut content).is_ok() {
                    if let Ok(new_entry) = serde_json::from_str::<CapturedCredential>(&content) {
                        if let Ok(mut queue) = PENDING_CREDENTIALS.lock() {
                            queue.push(new_entry.clone());
                        }

                        // Append to persistent cache file
                        let path = get_cache_path();
                        let mut entries: Vec<CapturedCredential> = fs::read_to_string(&path)
                            .ok()
                            .and_then(|data| serde_json::from_str(&data).ok())
                            .unwrap_or_default();
                        
                        entries.push(new_entry);
                        let _ = fs::write(path, serde_json::to_string(&entries).unwrap());

                        let mut res = Response::from_string("Saved successfully");
                        for h in &cors_headers { res = res.with_header(h.clone()); }
                        let _ = request.respond(res);
                        continue;
                    }
                }
                let mut res = Response::from_string("Failed to save").with_status_code(StatusCode(400));
                for h in &cors_headers { res = res.with_header(h.clone()); }
                let _ = request.respond(res);
            } else {
                let mut res = Response::from_string("Not Found").with_status_code(StatusCode(404));
                for h in &cors_headers { res = res.with_header(h.clone()); }
                let _ = request.respond(res);
            }
        }
    });
}