import requests
from dotenv import load_dotenv
import os

load_dotenv()

proxies = {
    "https": f"https://{os.getenv('PROXY_USERNAME')}:{os.getenv('PROXY_PASSWORD')}@{os.getenv('PROXY_SERVER')}"
}

def fetch_with_proxy(url):
    response = requests.get(url, proxies=proxies)

    response.raise_for_status()  # Raise an exception for HTTP errors
    
    return response
