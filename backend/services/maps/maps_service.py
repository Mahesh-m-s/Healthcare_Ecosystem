"""Mappls REST API helpers for server-side geocoding / nearby search."""
import httpx
from config import settings

MAPPLS_BASE = "https://apis.mappls.com"


async def nearby_hospitals(lat: float, lng: float, radius_km: int = 10) -> list:
    """Search for hospitals near a coordinate using Mappls Nearby API."""
    if not settings.mappls_api_key:
        return []
    try:
        url    = f"{MAPPLS_BASE}/advancedmaps/v1/{settings.mappls_api_key}/nearby"
        params = {"keywords": "hospital", "refLocation": f"{lat},{lng}",
                  "radius": radius_km * 1000, "richData": True}
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(url, params=params)
            r.raise_for_status()
            data = r.json()
            return data.get("suggestedLocations", [])
    except Exception as e:
        print(f"Mappls nearby error: {e}")
        return []


async def reverse_geocode(lat: float, lng: float) -> str:
    """Get address string for coordinates."""
    if not settings.mappls_api_key:
        return f"{lat:.4f}, {lng:.4f}"
    try:
        url = f"{MAPPLS_BASE}/advancedmaps/v1/{settings.mappls_api_key}/rev_geocode"
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.get(url, params={"lat": lat, "lng": lng})
            r.raise_for_status()
            data = r.json()
            return data.get("results", [{}])[0].get("formatted_address", f"{lat},{lng}")
    except Exception as e:
        return f"{lat:.4f}, {lng:.4f}"
