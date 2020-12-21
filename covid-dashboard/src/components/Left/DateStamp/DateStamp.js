import './DateStamp.css';

export default function DateStamp() {
    const date = new Date().toDateString();
    return (
    <div className='date_content'>
      {date}
    </div>
    );
}
