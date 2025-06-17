import pandas as pd
import matplotlib.pyplot as plt

# Шлях до файлу CSV
csv_path = r'D:\Лабт\Blog-Post-master\tests\results.csv'

# Завантаження CSV
df = pd.read_csv(csv_path)

# Відфільтруємо потрібні метрики
req_rate = df[df['metric_name'] == 'http_reqs']
req_duration = df[df['metric_name'] == 'http_req_duration']

# Перетворимо timestamp у секунди (можна відняти мінімальний, щоб почати з 0)
req_rate['time_sec'] = req_rate['timestamp'] - req_rate['timestamp'].min()
req_duration['time_sec'] = req_duration['timestamp'] - req_duration['timestamp'].min()

plt.figure(figsize=(12,6))

# Графік запитів в секунду
plt.plot(req_rate['time_sec'], req_rate['metric_value'], label='Запити/сек')

# Графік середнього часу відповіді (ms)
plt.plot(req_duration['time_sec'], req_duration['metric_value'], label='Середній час відповіді (мс)')

# Ділянка прогріву (перші 120 секунд)
plt.axvspan(0, 120, color='yellow', alpha=0.3, label='Прогрів')

plt.xlabel('Час (сек)')
plt.ylabel('Значення')
plt.title('Навантаження та продуктивність системи')
plt.legend()
plt.grid()
plt.show()
