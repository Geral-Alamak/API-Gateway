from fastapi import FastAPI, Request, HTTPException
import httpx

app = FastAPI(title="API Gateway")

# Internal service mapping (typically configured via environment variables)
SERVICES = {
    "pasien": "http://localhost:8001",
    "reservasi": "http://localhost:8002",
    "notifikasi": "http://localhost:8003"
}

@app.api_route("/{service_name}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def route_to_service(service_name: str, path: str, request: Request):
    if service_name not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not recognized by Gateway")

    target_url = f"{SERVICES[service_name]}/{path}"
    
    async with httpx.AsyncClient() as client:
        body = await request.body()
        try:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=dict(request.headers),
                content=body
            )
            return response.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail=f"{service_name.capitalize()} Service is unavailable")
