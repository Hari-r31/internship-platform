from decouple import config
from supabase import create_client, Client

# Read from .env using decouple
SUPABASE_URL = config("SUPABASE_URL")
SUPABASE_KEY = config("SUPABASE_SERVICE_ROLE_KEY")  # service role key for server

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_file(bucket_name: str, file_path: str, file_data):
    """
    Uploads a file to Supabase storage.
    `file_data` can be a file-like object (InMemoryUploadedFile) or bytes.
    """
    if hasattr(file_data, "read"):
        # file_data is a file-like object
        file_bytes = file_data.read()
    else:
        # assume it's bytes
        file_bytes = file_data

    response = supabase.storage.from_(bucket_name).upload(file_path, file_bytes)
    return response

def get_public_url(bucket_name: str, file_path: str) -> str:
    """Return the public URL of a file in Supabase storage."""
    result = supabase.storage.from_(bucket_name).get_public_url(file_path)
    # The new Storage SDK returns a dict with 'publicUrl' key
    return result.get("publicUrl") if isinstance(result, dict) else result

