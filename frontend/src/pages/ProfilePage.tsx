import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/auth-hook";
import { userService, type UserProfileData } from "../services/user-service";
import "./ProfilePage.css";

interface ProfileData {
  name: string;
  nickname: string;
  email: string;
  profilePicture: string;
  phone?: string;
  bio?: string;
}

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProfileData>({
    name: user?.name || "",
    nickname: user?.nickname || "",
    email: user?.email || "",
    profilePicture: user?.profilePicture || "",
    phone: "",
    bio: ""
  });
  
  const [previewImage, setPreviewImage] = useState<string>(user?.profilePicture || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        nickname: user.nickname || user.name || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "",
        phone: user.phone || "",
        bio: user.bio || ""
      });
      setPreviewImage(user.profilePicture || "");
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Read file and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData({ ...formData, profilePicture: base64String });
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Call API to update profile using the user service
      const response = await userService.updateProfile({
        name: formData.name,
        nickname: formData.nickname,
        profilePicture: formData.profilePicture,
        phone: formData.phone,
        bio: formData.bio
      });

      console.log("Profile update response:", response);

      if (response.success && response.data) {
        setSuccess("Profile updated successfully!");
        
        // Update user in AuthContext (will also update localStorage)
        updateUser({
          name: response.data.name,
          nickname: response.data.nickname,
          profilePicture: response.data.profilePicture,
          phone: response.data.phone,
          bio: response.data.bio
        });
        
        // Navigate back to dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-page">
      {/* Simple Navbar */}
      <nav className="profile-navbar">
        <div className="profile-navbar-container">
          <Link to="/dashboard" className="profile-navbar-brand">
            <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="15" fill="#2d5f4d"/>
              <path d="M30 15L42 25H38V40C38 41.1046 37.1046 42 36 42H24C22.8954 42 22 41.1046 22 40V25H18L30 15Z" fill="white"/>
              <circle cx="30" cy="32" r="3" fill="white" fillOpacity="0.3"/>
            </svg>
            <span>VINGOSI</span>
          </Link>
          <div className="profile-navbar-links">
            <Link to="/dashboard" className="profile-navbar-link">Dashboard</Link>
            <Link to="/expenses" className="profile-navbar-link">Expenses</Link>
            <Link to="/savings" className="profile-navbar-link">Savings</Link>
            <Link to="/profile" className="profile-navbar-link profile-navbar-link--active">Profile</Link>
          </div>
        </div>
      </nav>
      
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account information and preferences</p>
        </div>

        <div className="profile-content">
          {/* Profile Picture Card */}
          <div className="profile-picture-card">
            <h2 className="profile-section-title">Profile Picture</h2>
            <div className="profile-picture-wrapper">
              <div className="profile-picture-container" onClick={handleImageClick}>
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="profile-picture-preview" />
                ) : (
                  <div className="profile-picture-placeholder">
                    <span className="profile-picture-initials">
                      {getInitials(formData.nickname || formData.name)}
                    </span>
                  </div>
                )}
                <div className="profile-picture-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Upload Photo</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="profile-picture-input"
              />
              <p className="profile-picture-hint">Click to upload • Max 5MB • JPG, PNG, GIF</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form-card">
            <h2 className="profile-section-title">Personal Information</h2>
            
            {error && (
              <div className="profile-alert profile-alert--error">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="profile-alert profile-alert--success">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
                </svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="profile-form-row">
                <div className="profile-form-field">
                  <label htmlFor="name" className="profile-label">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10ZM10 12.5C6.66667 12.5 0 14.175 0 17.5V20H20V17.5C20 14.175 13.3333 12.5 10 12.5Z" fill="currentColor"/>
                    </svg>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="profile-form-field">
                  <label htmlFor="nickname" className="profile-label">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5 4.98332C16.2417 3.73332 14.6084 3.09999 12.9084 3.05832C11.2 3.01666 9.47502 3.56666 8.10835 4.62499C6.74169 3.56666 5.01669 3.01666 3.30835 3.05832C1.60835 3.09999 -0.0249848 3.73332 -1.28332 4.98332L-1.58332 5.28332L10 16.8833L21.5833 5.28332L17.5 4.98332Z" fill="currentColor"/>
                    </svg>
                    Nickname
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="Enter your nickname"
                    required
                  />
                </div>
              </div>

              <div className="profile-form-row">
                <div className="profile-form-field">
                  <label htmlFor="email" className="profile-label">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 5.83333L10 10.8333L17.5 5.83333M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    className="profile-input"
                    placeholder="your.email@example.com"
                    disabled
                  />
                  <p className="profile-field-hint">Email cannot be changed</p>
                </div>

                <div className="profile-form-field">
                  <label htmlFor="phone" className="profile-label">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.3333 14.1V16.6C18.3343 16.8321 18.2867 17.0618 18.1937 17.2744C18.1008 17.487 17.9644 17.6779 17.7934 17.8349C17.6224 17.9919 17.4205 18.1112 17.2006 18.1855C16.9808 18.2599 16.7478 18.2875 16.5167 18.2667C13.9523 17.9881 11.489 17.1118 9.32498 15.7084C7.31151 14.4289 5.60443 12.7218 4.32499 10.7084C2.91663 8.53438 2.04019 6.05919 1.76665 3.48337C1.74589 3.25293 1.77336 3.02067 1.84718 2.80139C1.921 2.58211 2.03951 2.38064 2.19562 2.2098C2.35173 2.03896 2.54161 1.90223 2.75328 1.80876C2.96495 1.71529 3.19369 1.66711 3.42499 1.66671H5.92499C6.32953 1.66283 6.72148 1.80628 7.028 2.06942C7.33452 2.33256 7.53155 2.69955 7.58332 3.10004C7.68011 3.90007 7.86284 4.68552 8.12832 5.44171C8.24787 5.7459 8.27718 6.07726 8.21281 6.39712C8.14845 6.71699 7.99308 7.01099 7.76665 7.24171L6.74165 8.26671C7.92795 10.3614 9.63867 12.0721 11.7333 13.2584L12.7583 12.2334C12.9891 12.007 13.2831 11.8516 13.6029 11.7872C13.9228 11.7229 14.2541 11.7522 14.5583 11.8717C15.3145 12.1372 16.1 12.3199 16.9 12.4167C17.3048 12.4688 17.6755 12.6694 17.9388 12.9813C18.2021 13.2932 18.3416 13.6914 18.3333 14.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="profile-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="profile-form-field">
                <label htmlFor="bio" className="profile-label">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.66667 7.5H13.3333M6.66667 10.8333H13.3333M6.66667 14.1667H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="profile-textarea"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="profile-form-actions">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="profile-button profile-button--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-button profile-button--primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="profile-spinner"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14.1667 2.5V7.5H5.83333V2.5M10 10.8333V14.1667M7.5 12.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
div>
      </div>
    </div>
  );
};

export default ProfilePage;
