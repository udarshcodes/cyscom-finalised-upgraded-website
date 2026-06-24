import secrets
import hashlib
import time
import webbrowser as w
salt='ZYPHER'

import os
secret_key_prior=os.environ.get('SECRET_KEY_PRIOR')
if secret_key_prior is None:
    secret_key_prior = secrets.token_urlsafe(32)
import os
secret_key_main = os.environ.get('SECRET_KEY_MAIN')
if secret_key_main is None:
    secret_key_main = secrets.token_urlsafe(32)
secret_key_latter='}'


def intro():
    global username
    username=input("Enter your username...")
    time.sleep(2)
    
    print(  "===================================================\n\n")
    
def menu():
    print("Welcome " +"Ryan"+"!\n")
    time.sleep(2)
    print("That's ryt..\n")
    time.sleep(1)
    print("we know who you are and what you're upto")
    time.sleep(3)
    print("what we do not know is, are you really as skilled as you think you're..")
    time.sleep(5)
    print("If you've reached till here, it does indicate that u've some impressive abilities")
    time.sleep(8)
    print("But this one is no cake son...solve this to decipher ur 'destiny'")
    time.sleep(5)
    print("Or shd I say "+salt)
    time.sleep(4)
    print(  "===================================================\n\n")
    
    print(salt+"\n\n\
Menu:\n\
(a) Unlock secret file\n\
(b) Solve Side Quests\n\
(c) Enter key\n\
(d) Exit ")

    choice = input("What would you like to do, "+ username +" (a/b/c/d)? ")
    
if choice == 'a':
    url = 'https://cyscomvit.com/'  # replace url with encrypted file location url
    w.open(url)
elif choice == 'c':
    x = input()
    if key(x):
        print("Key accepted")
        time.sleep(3)
        print("now find the flag and use it to unlock the secret files")
        time.sleep(7)
        print("good luck")
    else:
        print("Key invalid")
else:
    global loop
    loop = False
    print("Choose stg within the menu kid..")

def encrypt(flag, key):
    enc = ''.join([chr((ord(flag[i]) << key) + ord(flag[i + 1])) + chr((ord(salt[secrets.randbelow(10) + 1]) << key)) for i in range(0, len(flag), 2)])
    print(enc)
    return enc

def decrypt(enc_text,key):
    ...
    #return flag
    #use the flag to unlock file


def key(x):
    if x==hashlib.sha256(salt.encode('utf-8')).hexdigest()[4]:
        return True

#encrypt('FLAG',x)

loop=True

def ui_flow():
    intro()
    if username=='FOX3R':
        while loop:
            menu()   
    else:
        print("Access denied")  
ui_flow()
