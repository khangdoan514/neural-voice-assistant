from datetime import datetime

# User model
class User:    
    def __init__(self, id=None, email=None, password_hash=None, role='user', created_at=None, updated_at=None, last_login=None):
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.last_login = last_login
    
    # Create User object from dictionary
    @classmethod
    def from_dict(cls, data):
        if not data:
            return None
        return cls(
            id=data.get('id'),
            email=data.get('email'),
            password_hash=data.get('password_hash'),
            role=data.get('role', 'user'),
            created_at=data.get('created_at'),
            updated_at=data.get('updated_at'),
            last_login=data.get('last_login')
        )
    
    # Convert User to dictionary for JSON response
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }