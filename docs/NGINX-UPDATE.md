# **Nginx Configuration Update Guide**

Changed Nginx settings, added routes, or modified proxy rules.

### **1. SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@3.149.203.1
```

### **2. Edit Nginx configuration**

```bash
sudo nano /etc/nginx/sites-available/neural-voice-assistant
```

### **3. Test configuration for syntax errors**

```bash
sudo nginx -t
```

### **4. Reload Nginx to apply changes**

```bash
sudo systemctl reload nginx
```

### **5. Verify site still works**

```bash
curl -I https://etpoultry.com
```

### **6. Verify API still works (if proxied)**

```bash
curl https://etpoultry.com/api/conversations
```

### **7. Check Nginx error logs if issues**

```bash
sudo tail -20 /var/log/nginx/error.log
```