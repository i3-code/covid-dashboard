import './Center.css';
import Map from './Map/Map';

export default function Center(props) {
    return (
      <main className="Center">
          <Map api={props.api} />
      </main>
    );
}