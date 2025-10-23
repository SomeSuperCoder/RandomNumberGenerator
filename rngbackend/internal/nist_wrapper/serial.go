package nistwrapper

import "github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"

func SerialTest(bitArray *nist80022.BitArray) *TestResult {
	const name = "Тест на распределение шаблонов"
	const desc = "Проверяет, насколько равномерно в последовательности встречаются все возможные комбинации битов (например, 00, 01, 10, 11). В случайных данных все комбинации должны появляться примерно одинаково часто"

	_, result := nist80022.SerialTest(bitArray, 10)

	return &TestResult{
		Name:        name,
		Description: desc,
		Result:      result,
	}
}
