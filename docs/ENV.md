# **Environment Variables (.env) Update Guide**

Added, modified, or removed environment variables.

### **1. SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@3.149.203.1
```

### **2. Navigate to project root**

```bash
cd ~/neural-voice-assistant
```

### **3. Edit .env file**

```bash
nano .env
```

### **4. Restart backend to load new variables**

```bash
pm2 restart backend
```

### **5. Verify backend is running**

```bash
pm2 status
```

### **6. Check logs for loading errors**

```bash
pm2 logs backend --lines 20
```

### **7. Test API to confirm variables loaded**

```bash
curl https://etpoultry.com/api/conversations
```

### **8. Set proper permissions for security**

```bash
chmod 600 .env
```