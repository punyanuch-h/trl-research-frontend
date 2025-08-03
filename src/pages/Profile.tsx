import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "../components/Header"; 

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstname: "Sitthida",
    lastname: "Suwan",
    email: "sitthida@example.com",
    phone: "0801234567",
    role: "Researcher",
    organization: "My University",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: Add API call to save profile
    console.log("Saved user data:", userData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-10 px-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                name="firstname"
                placeholder="First Name"
                value={userData.firstname}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                name="lastname"
                placeholder="Last Name"
                value={userData.lastname}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone"
                value={userData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                name="role"
                placeholder="Role"
                value={userData.role}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <Input
                name="organization"
                placeholder="Organization"
                value={userData.organization}
                onChange={handleChange}
                disabled={!isEditing}
              />

              <div className="flex justify-end gap-4 mt-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}