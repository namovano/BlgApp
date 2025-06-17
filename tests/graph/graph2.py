import matplotlib.pyplot as plt

# Прикладні дані CPU і Memory (відсотки використання)
cpu_data = [20, 30, 50, 80, 90, 85, 60]
mem_data = [30, 40, 60, 85, 95, 90, 70]

plt.figure(figsize=(12, 6))

plt.plot(cpu_data, label='CPU %')
plt.plot(mem_data, label='Memory %')

# Прогрів (перша частина графіка)
plt.axvspan(0, 3, color='yellow', alpha=0.3, label='Прогрів')

plt.title('Використання ресурсів сервера')
plt.xlabel('Час (с)')
plt.ylabel('Відсоток використання')
plt.legend()
plt.grid()

# Збереження графіка у файл
plt.savefig(r'D:\Лабт\Blog-Post-master\tests\graph2.png')

plt.show()
