DROP TABLE IF EXISTS myTasks;
CREATE TABLE myTasks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    stage TEXT NOT NULL,
    days TEXT NOT NULL,
    stat INTEGER,
    work_hours INTEGER,
    received TEXT NOT NULL
)
