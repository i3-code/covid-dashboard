import Table from './Table/Table';
export default function Right(props) {
    return (
      <div className="Right">
        <Table api={props.api} />
      </div>
    );
}
