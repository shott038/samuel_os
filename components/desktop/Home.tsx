import BootSequence from "@/components/desktop/BootSequence";
import ChatPanel from "@/components/desktop/ChatPanel";
import ContactTerminal from "@/components/desktop/ContactTerminal";
import FileExplorer from "@/components/desktop/FileExplorer";
import FileViewer from "@/components/desktop/FileViewer";
import LayoutShell from "@/components/desktop/LayoutShell";
import StatusBar from "@/components/desktop/StatusBar";
import SignalOverlay from "@/components/shared/SignalOverlay";

export default function DesktopHome() {
  return (
    <div data-platform="desktop" className="contents">
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
