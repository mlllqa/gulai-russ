<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminController extends Controller
{
    // 🔹 Список таблиц
    public function listTables()
    {
        $tables = DB::select("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
        $tableNames = array_map(fn($t) => $t->tablename, $tables);

        return response()->json($tableNames);
    }

    // 🔹 Список представлений
    public function listViews()
    {
        $views = DB::select("SELECT viewname FROM pg_views WHERE schemaname = 'public'");
        $viewNames = array_map(fn($v) => $v->viewname, $views);

        return response()->json($viewNames);
    }

    // 🔹 Получить данные из таблицы
    public function getTableData($table)
    {
        if (!Schema::hasTable($table)) {
            return response()->json(['error' => 'Table not found'], 404);
        }

        try {
            $data = DB::table($table)->limit(100)->get();
            return response()->json($data);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Table fetch failed', 'details' => $e->getMessage()], 400);
        }
    }

    // 🔹 Получить данные из представления с возможной фильтрацией
    public function getViewData(Request $request, $view)
    {
        try {
            $query = DB::table($view);

            if ($view === 'view_clients_total_spent' && $request->filled('minSpent')) {
                $query->where('total_spent', '>', (int) $request->input('minSpent'));
            }

            if ($view === 'view_clients_by_period') {
                if ($request->filled('from')) {
                    $query->where('start_date', '>=', $request->input('from'));
                }
                if ($request->filled('to')) {
                    $query->where('end_date', '<=', $request->input('to'));
                }
            }

            if ($view === 'view_clients_by_tour_type' && $request->filled('tour_type')) {
                $query->where('tour_type', '=', $request->input('tour_type'));
            }

            $data = $query->limit(100)->get();
            return response()->json($data);

        } catch (\Throwable $e) {
            return response()->json(['error' => 'View fetch failed', 'details' => $e->getMessage()], 404);
        }
    }

    // 🔹 ✅ Обновлённое добавление записи
    public function createRecord(Request $request, $table)
    {
        if (!Schema::hasTable($table)) {
            return response()->json(['error' => 'Table not found'], 404);
        }

        try {
            $data = $request->all();
            $id = DB::table($table)->insertGetId($data);
            $row = DB::table($table)->where('id', $id)->first(); // ← получаем вставленную строку
            return response()->json($row, 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Insert failed', 'details' => $e->getMessage()], 400);
        }
    }

    // 🔹 Обновление записи
    public function updateRecord(Request $request, $table, $id)
    {
        if (!Schema::hasTable($table)) {
            return response()->json(['error' => 'Table not found'], 404);
        }

        try {
            DB::table($table)->where('id', $id)->update($request->all());
            return response()->json(['message' => 'Record updated']);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Update failed', 'details' => $e->getMessage()], 400);
        }
    }

    // 🔹 Удаление записи
    public function deleteRecord($table, $id)
    {
        if (!Schema::hasTable($table)) {
            return response()->json(['error' => 'Table not found'], 404);
        }

        try {
            DB::table($table)->where('id', $id)->delete();
            return response()->json(['message' => 'Record deleted']);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Delete failed', 'details' => $e->getMessage()], 400);
        }
    }

    // 🔹 Вывод схемы (таблицы и столбцы)
    public function dumpSchema()
    {
        $columns = DB::table('information_schema.columns')
            ->select('table_name', 'column_name', 'data_type')
            ->where('table_schema', 'public')
            ->orderBy('table_name')
            ->orderBy('ordinal_position')
            ->get();

        return response()->json($columns);
    }
}
