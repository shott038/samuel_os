import DesktopHome from "@/components/desktop/Home";
import MobileHome from "@/components/mobile/Home";
import { detectPlatform } from "@/lib/platform";

// The sniffer decides per-request which component tree the visitor gets —
// phones never receive desktop markup and vice versa.
export default async function Home() {
  const platform = await detectPlatform();
  return platform === "mobile" ? <MobileHome /> : <DesktopHome />;
}
