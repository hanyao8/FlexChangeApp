<?php

namespace App\Table;

use Cake\Database\Connection;
use Cake\Database\Query;
use Cake\Database\StatementInterface;

/**
 * Class AbstractTable.
 */
abstract class AbstractTable implements ModelInterface
{
    protected $table = null;

    protected  $connection = null;

    /**
     * AppTable constructor.
     *
     * @todo rename model to table
     *
     * @param Connection $connection
     */
    public function __construct(Connection $connection = null)
    {
        $this->connection = $connection;
    }

    /**
     * Get Query.
     *
     * @return Query
     */
    public function newSelect(): Query
    {
        return $this->connection->newQuery()->from($this->table);
    }

    /**
     * Get all entries from database.
     *
     * @return array $rows
     */
    public function getAll(): array
    {
        $query = $this->newSelect();
        $query->select('*');
        $rows = $query->execute()->fetchAll('assoc');

        return $rows;
    }

    /**
     * Insert into database.
     *
     * @param array $row with data to insertUser into database
     *
     * @return StatementInterface
     */
    public function insert(array $row): StatementInterface
    {
        return $this->connection->insert($this->table, $row);
    }

    /**
     * Update database.
     *
     * @param string $where should be the id
     * @param array $row
     *
     * @return StatementInterface
     */
    public function update(array $row, $where): StatementInterface
    {
        $query = $this->connection->newQuery();
        $query->update($this->table)
            ->set($row)
            ->where($where);

        return $query->execute();
    }

    /**
     * Delete from database.
     *
     * @param string $id
     *
     * @return StatementInterface
     */
    public function delete(string $id): StatementInterface
    {
        return $this->connection->delete($this->table, ['id' => $id]);
    }
}
