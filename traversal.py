import os
import time
import requests
from utils import Stack, Queue

key = os.environ.get('TREASUREKEY')

headers = {
    'Authorization': f'Token {key}',
    'Content-Type': 'application/json'
}
init_response = requests.get("https://lambda-treasure-hunt.herokuapp.com/api/adv/init/", headers=headers)
init_data = init_response.json()
print(init_data)
