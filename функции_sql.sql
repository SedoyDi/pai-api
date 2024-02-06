--- в процессе выполнения задания, из-за того, что с sql не работал от слова совсем... 
--- функции писал и знакомился с самой базой при помощи поисковика, глубокого понимания в этой теме не имею
--- результат пробы пера в sql ниже ;)
--- спасибо за возможность прикоснуться к новым технологиям Docker и DBeaver так же увидел впервые, 
--- было интересно, спасибо за опыт!



CREATE FUNCTION select_count_pok_by_service(int,date) RETURNS TABLE(acc int , serv int, count int )
    AS $$ 
  SELECT Accounts.number, 
         Counters.service,
       count(Counters.acc_id)
  FROM Accounts
    join Counters on Counters.acc_id = Accounts.row_id
    join Meter_Pok on Meter_Pok.counter_id = Counters.row_id
  where Counters.service = $1 and Meter_Pok.date = $2
  group by Accounts.number,Counters.service
  order by Accounts.number
  $$
    LANGUAGE SQL;


CREATE FUNCTION select_value_by_house_and_month(int,date) RETURNS TABLE(acc int , name text, value int )
    AS $$ 
  with recursive house as (select *
           from Accounts
           where Accounts.number = $1 and Accounts.type = '1'
           union all          
           select Accounts.row_id,
           Accounts.parent_id,
           Accounts.number,
           Accounts.type
           from house 
           join Accounts on Accounts.parent_id = house.row_id
)
SELECT house.number,
Counters.name,
sum(Meter_Pok.value)
FROM house 
join Counters on Counters.acc_id = house.row_id
join Meter_Pok on Meter_Pok.counter_id = Counters.row_id
where house.type = '3' and Meter_Pok.month = $2
group by house.number,Counters.name
order by house.number
  $$
    LANGUAGE SQL;


CREATE FUNCTION select_last_pok_by_acc(int) RETURNS TABLE(acc int , serv int, date date, tarif int, value int )
    AS $$ 
SELECT Accounts.number,
Counters.service,
Meter_Pok.date,
Meter_Pok.tarif,
Meter_Pok.value
FROM Accounts
join Counters on Counters.acc_id = Accounts.row_id
join Meter_Pok on Meter_Pok.counter_id = Counters.row_id
join (select max(Meter_Pok.date) as max_date,
    Counters.service 
   FROM Accounts
   join Counters on Counters.acc_id = Accounts.row_id
     join Meter_Pok on Meter_Pok.counter_id = Counters.row_id 
   where Accounts.number = $1 
   group by Counters.service
   LIMIT 4
   ) Meter_Pok_Nearest on Meter_Pok_Nearest.max_date = Meter_Pok.date and Meter_Pok_Nearest.service = Counters.service
where Accounts.number = $1
order by Counters.service
  $$
    LANGUAGE SQL;