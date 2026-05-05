import { Session } from "next-auth";

export interface UserProfile {
  id?: string;
  email?: string;
  username?: string;
  createdAt?: string;
  role?: string;
  mfaEnabled?: boolean;
}

interface AccountDetailsProps {
  profile?: UserProfile;
  session?: Session | null;
  isLoading: boolean;
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-discord-text-muted text-[15px]">{label}</span>
      <div className="text-white font-medium text-[15px]">{value}</div>
    </div>
  );
}

export function AccountDetails({ profile, session, isLoading }: AccountDetailsProps) {
  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord-blurple"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <InfoRow
        label="Display Name:"
        value={profile?.username || session?.user?.name || session?.username || "Loading..."}
      />

      <InfoRow
        label="Email:"
        value={profile?.email || session?.user?.email || "Unknown"}
      />

      <InfoRow
        label="Membership Status:"
        value="Free Tier"
      />

      <InfoRow
        label="Account Verification:"
        value={
          <span className="text-[#23a559] bg-[#23a559]/10 px-2 py-0.5 rounded text-sm font-medium border border-[#23a559]/20">
            Verified
          </span>
        }
      />
    </div>
  );
}
