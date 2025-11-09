import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserProfile } from "@/hooks/user/get/useGetUserProfile";
import formatPhoneNumber from "@/utils/phone";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { data: userProfile } = useGetUserProfile();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-center py-10 px-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <ArrowLeft className="w-6 h-6 mr-2 cursor-pointer" onClick={() => navigate(-1)} />
            <CardTitle className="text-center text-2xl">User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="first_name" className="text-sm font-medium text-primary">Name</label>
                <span className="text-base font-medium border border-gray-300 rounded-md p-2">{userProfile?.first_name} {userProfile?.last_name}</span>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="academic_position" className="text-sm font-medium text-primary">Academic Position</label>
                <span className="text-base font-medium border border-gray-300 rounded-md p-2">{userProfile?.academic_position}</span>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="department" className="text-sm font-medium text-primary">Department</label>
                <span className="text-base font-medium border border-gray-300 rounded-md p-2">{userProfile?.department}</span>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
                <span className="text-base font-medium border border-gray-300 rounded-md p-2">{userProfile?.email}</span>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone_number" className="text-sm font-medium text-primary">Phone Number</label>
                <span className="text-base font-medium border border-gray-300 rounded-md p-2">{formatPhoneNumber(userProfile?.phone_number)}</span>
              </div>

              {/* TODO: implement real API edit profile */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}