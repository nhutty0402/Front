export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  )
}
