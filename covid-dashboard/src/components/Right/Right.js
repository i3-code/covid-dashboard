import Table from './Table/Table';
import Filters from './Filters/Filters';
import Graph from './Graph/Graph';

export default function Right(props) {
    return (
      <div className="Right">
        <Table api={props.api} />
        <Filters api={props.api} />
        <Graph api={props.api} />
      </div>
    );
}
