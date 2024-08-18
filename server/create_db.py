# create a db and table with parameters
import sqlite3

connie = sqlite3.connect('task.db')
 
def init_db():
    with open('schema.sql') as fp:
        connie.executescript(fp.read())
    keys=('id','name','stage','days','stat','work_hours','received')
    tasky = [('1','組み付け','modeling','06-18,06-19,06-20',20,38,'2023-11-01'),('2','データ処理方法','資料作成','06-17,06-21',60,4,'2024-06-17'),('3','Know-How','資料作成','2024-06-21',10,20,'2023-06-27')]
    marks = ','.join(['?' for _ in keys])
    curs = connie.cursor()
    for item in tasky:
        curs.execute(f"INSERT INTO myTasks ({keys}) VALUES ({marks})",item)
        connie.commit()
    connie.close()

curs = connie.cursor()
print(curs.execute("SELECT * FROM myTasks").fetchall())
connie.close()


