# **Backend Dependencies Update Guide**

When `requirements.txt` has changed or you need to update Python packages.

### **1. SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@3.149.203.1
```

### **2. Navigate to backend**

```bash
cd ~/neural-voice-assistant/backend
```

### **3. Activate virtual environment**

```bash
source ../venv/bin/activate
```

### **4. Update pip itself**

```bash
pip install --upgrade pip
```

### **5. Install/update all dependencies**

```bash
pip install -r ../requirements.txt --upgrade
```

### **6. Update requirements.txt with exact versions**

```bash
pip freeze > ../requirements.txt
```

### **7. Restart backend**

```bash
pm2 restart backend
```

### **8. Verify dependencies are installed**

```bash
pip list | grep -E "flask|gunicorn|requests"
```