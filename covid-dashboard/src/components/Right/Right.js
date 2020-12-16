import Table from './Table/Table';
import Filters from './Filters/Filters';
export default function Right(props) {
    return (
      <div className="Right">
        <Table api={props.api} />
        <Filters api={props.api} />
      </div>
    );
}
