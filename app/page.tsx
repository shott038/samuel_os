import LayoutShell from "@/components/LayoutShell";
import StatusBar from "@/components/StatusBar";
import LeftPanel from "@/components/LeftPanel";
import ChatPanel from "@/components/ChatPanel";
import FileViewer from "@/components/FileViewer";
import SignalOverlay from "@/components/SignalOverlay";
import ContactTerminal from "@/components/ContactTerminal";
export default function Home() {
  return (
    <>
      <LayoutShell
        status={<StatusBar />}
        left={<LeftPanel />}
        right={
          <>
            <noscript>
              <div className="p-6 text-sm text-muted">
                Samuel OS requires JavaScript to interface with the model.
              </div>
            </noscript>
            <ChatPanel />
          </>
        }
      />
      <FileViewer />
      <ContactTerminal />
      <SignalOverlay />
    </>
  );
}
