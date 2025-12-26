import hashlib
import hmac
import base64

def generate_esewa_signature(secret_key, message):
    """
    Generates HMAC SHA256 signature for eSewa.
    Message format: "total_amount,transaction_uuid,product_code"
    """
    secret = bytes(secret_key, 'utf-8')
    message = bytes(message, 'utf-8')

    hash_object = hmac.new(secret, message, hashlib.sha256)
    signature = base64.b64encode(hash_object.digest()).decode('utf-8')
    return signature
