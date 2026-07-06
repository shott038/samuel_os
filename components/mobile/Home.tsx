import BootSequence from "@/components/mobile/BootSequence";
import ChatPanel from "@/components/mobile/ChatPanel";
import ContactTerminal from "@/components/mobile/ContactTerminal";
import FileExplorer from "@/components/mobile/FileExplorer";
import FileViewer from "@/components/mobile/FileViewer";
import LayoutShell from "@/components/mobile/LayoutShell";
import StatusBar from "@/components/mobile/StatusBar";
import SignalOverlay from "@/components/shared/SignalOverlay";

export default function MobileHome() {
  return (
    <div data-platform="mobile" className="contents">
      <BootSequence />
      <LayoutShell
        status={<StatusBar />}
        left={<FileExplorer />}
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
    </div>
  );
}
