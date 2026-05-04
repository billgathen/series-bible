FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt requirements-ml.txt ./
RUN pip install -r requirements.txt -r requirements-ml.txt

COPY . .
ENTRYPOINT [ "./entrypoint.sh" ]
CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]