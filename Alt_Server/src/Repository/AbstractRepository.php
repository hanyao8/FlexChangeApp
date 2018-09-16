<?php
namespace App\Repository;

/**
 * Class AppRepository
 */
abstract class AbstractRepository
{
    /**
     * Check if something exists in table.
     *
     * @param $table
     * @param array $condition
     * @return bool
     */
    protected function exists($table, array $condition): bool
    {
        $query = $table->newSelect();
        $query->select(1)->where($condition);
        $row = $query->execute()->fetch();
        return !empty($row);
    }
}