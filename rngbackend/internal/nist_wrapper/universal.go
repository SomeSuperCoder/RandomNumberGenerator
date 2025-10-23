package nistwrapper

import "github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"

func UniversalTest(bitArray *nist80022.BitArray) *TestResult {
	const name = "Универсальный статистический тест"
	const desc = "Проверяет, насколько последовательность \"сжимаема\", анализируя расстояния между одинаковыми фрагментами. В случайных данных эти расстояния имеют определенную величину"

	_, result := nist80022.RunsTest(bitArray)

	return &TestResult{
		Name:        name,
		Description: desc,
		Result:      result,
	}
}
