# **Dependencies Update Guide**

Update npm (frontend) and pip (backend) packages.

### **1. SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@3.149.203.1
```

### **2. Update frontend dependencies**

```bash
cd ~/neural-voice-assistant/frontend
npm outdated
npm update
npm install --save-exact
```

### **3. Rebuild frontend after updates**

```bash
npm run build
sudo cp -r dist/* /var/www/neural-voice-assistant/
```

### **4. Update backend dependencies**

```bash
cd ~/neural-voice-assistant/backend
source ../venv/bin/activate
pip list --outdated
pip install --upgrade pip
pip install -r ../requirements.txt --upgrade
```

### **5. Update requirements.txt with new versions**

```bash
pip freeze > ../requirements.txt
```

### **6. Restart backend**

```bash
pm2 restart backend
```

### **7. Verify frontend works**

```bash
curl -I https://etpoultry.com
```

### **8. Verify backend works**

```bash
curl https://etpoultry.com/api/conversations
```