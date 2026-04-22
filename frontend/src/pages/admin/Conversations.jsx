import { DocumentTextIcon, FolderIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline"

export default function Conversations({
  conversations,
  isLoading,
  selectedConversation,
  conversationContent,
  isLoadingContent,
  fetchConversationContent,
  formatFileSize,
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      <div className="xl:col-span-1 bg-paper/30 rounded-lg border border-rust/20 p-4 sm:p-5">
        <h2 className="font-label text-xl text-foreground mb-4 flex items-center">
          <FolderIcon className="h-5 w-5 mr-2 text-rust" />
          Conversation Files
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rust"></div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[62vh] xl:max-h-[68vh] overflow-y-auto pr-2">
            {Array.isArray(conversations) &&
              conversations.map((conv) => (
                <button
                  key={conv.name}
                  type="button"
                  onClick={() => fetchConversationContent(conv.name)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedConversation?.filename === conv.name
                      ? "bg-rust/20 border border-rust"
                      : "bg-paper hover:bg-paper/80 border border-rust/10 hover:border-rust/30"
                  }`}
                >
                  <div className="flex items-start">
                    <DocumentTextIcon className="h-5 w-5 text-rust mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-foreground truncate">{conv.name}</p>
                      <div className="flex items-center text-sm text-muted mt-1 space-x-2">
                        <span className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {new Date(conv.modified).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatFileSize(conv.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

            {(!conversations || conversations.length === 0) && !isLoading && (
              <p className="text-muted text-sm text-center py-8">No conversation files found</p>
            )}
          </div>
        )}
      </div>

      <div className="xl:col-span-2 bg-paper/30 rounded-lg border border-rust/20 p-4 sm:p-6 min-w-0">
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-label text-xl text-foreground flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-rust" />
                {selectedConversation.filename}
              </h3>
              <button
                type="button"
                onClick={() => fetchConversationContent(selectedConversation.filename)}
                className="text-sm text-rust hover:text-rust-light"
              >
                Refresh
              </button>
            </div>

            {isLoadingContent ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rust"></div>
              </div>
            ) : (
              <div className="bg-barn rounded-lg p-3 sm:p-4 border border-rust/10 overflow-auto max-h-[62vh] xl:max-h-[68vh]">
                <pre className="text-sm sm:text-base text-muted whitespace-pre-wrap font-mono break-words">
                  {conversationContent}
                </pre>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DocumentTextIcon className="h-16 w-16 text-rust/30 mb-4" />
            <p className="text-muted text-base">Select a conversation file to view its content</p>
          </div>
        )}
      </div>
    </div>
  )
}
