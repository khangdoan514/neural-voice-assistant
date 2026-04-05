# **SSL Certificate Update Guide**

Renew Let's Encrypt certificates (valid for 90 days, auto-renews).

### **1. SSH into EC2**

```bash
ssh -i your-key.pem ubuntu@3.149.203.1
```

### **2. Check current certificate status**

```bash
sudo certbot certificates
```

### **3. Test auto-renewal (dry run)**

```bash
sudo certbot renew --dry-run
```

### **4. Force manual renewal if needed**

```bash
sudo certbot --nginx -d etpoultry.com -d www.etpoultry.com --force-renewal
```

### **5. Reload Nginx to use new certificate**

```bash
sudo systemctl reload nginx
```

### **6. Verify new certificate is active**

```bash
sudo certbot certificates | grep -E "Expiry Date|Domains"
```

### **7. Test HTTPS connection**

```bash
curl -I https://etpoultry.com
```

### **8. Check SSL handshake**

```bash
openssl s_client -connect etpoultry.com:443 -servername etpoultry.com 2>/dev/null | grep -E "verify return code|subject"
```