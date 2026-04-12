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

### **6. Start backend with PM2**

```bash
pm2 start main.py --name "backend" --interpreter python3
```

### **7. Save PM2 configuration**

```bash
pm2 save
```

### **8. Set up PM2 to start on boot**

```bash
pm2 startup
```

### **9. Restart backend with PM2**

```bash
pm2 restart backend
```

### **10. Verify backend is running**

```bash
pm2 status
```

### **11. Test API endpoint**

```bash
curl https://etpoultry.com/api/conversations
```