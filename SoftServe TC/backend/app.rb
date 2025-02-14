require 'sinatra'
require 'json'
require 'pg'


DB = PG.connect(
  dbname: 'softserve',
  user: 'postgres',
  password: '1111',
  host: 'localhost'
)

post '/submit' do
  begin
    request_data = JSON.parse(request.body.read)
    name = request_data['name']
    email = request_data['email']
    course = request_data['course']

    if name.empty? || email.empty? || course.empty?
      halt 400, { message: 'Всі поля повинні бути заповнені!' }.to_json
    end

    DB.exec_params(
      "INSERT INTO submissions (name, email, course) VALUES ($1, $2, $3)",
      [name, email, course]
    )

    content_type :json
    { title: "Заявка надіслана!", message: "Дякуємо, #{name}! Ми зв'яжемося з Вами." }.to_json

  rescue JSON::ParserError
    status 400
    { message: 'Некоректний формат JSON' }.to_json

  rescue PG::Error => e
    status 500
    { message: "Помилка бази даних: #{e.message}" }.to_json
  end
end

before do
  response.headers['Access-Control-Allow-Origin'] = '*'
  response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
end

options '/submit' do
  status 200
end

get '/' do
  "Бекенд працює!"
end
