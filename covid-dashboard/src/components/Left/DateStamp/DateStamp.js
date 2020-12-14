export default function DateStamp() {
    const date = new Date().toDateString();
    return (
    <div>
      {date}
    </div>
    );
}
