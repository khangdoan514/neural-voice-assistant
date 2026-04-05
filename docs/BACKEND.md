# **Backend Update Guide**

Only changed Flask routes, API logic, or backend Python code.

### **1. SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@3.149.203.1
```

### **2. Navigate to backend**

```bash
cd ~/neural-voice-assistant/backend
```

### **3. Pull latest code (if using git)**

```bash
git pull origin main
```

### **4. Activate virtual environment**

```bash
source ../venv/bin/activate
```

### **5. Install/update backend dependencies**

```bash
pip install -r ../requirements.txt
```

### **6. Restart backend with PM2**

```bash
pm2 restart backend
```

### **7. Verify backend is running**

```bash
pm2 status
```

### **8. Test API endpoint**

```bash
curl https://etpoultry.com/api/conversations
```