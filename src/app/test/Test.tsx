export default function Test() {
  return <div className="max-w-2xl mx-auto p-4">
    <button
      // className="mb-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      style={
        {
          marginBottom: "1rem",
          backgroundColor: "blue",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          transition: "background-color 0.2s",
        }
      }
    >
      Test Button
    </button>

  </div>
}