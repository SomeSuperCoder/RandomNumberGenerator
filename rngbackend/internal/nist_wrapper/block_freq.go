package nistwrapper

import "github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"

func BlockFrequencyTest(bitArray *nist80022.BitArray) *TestResult {
	const name = "Проверка частот блоков"
	const desc = "Проверяет, равномерно ли распределены нули и единицы в последовательности, разбитой на блоки"

	_, result := nist80022.BlockFrequencyTest(bitArray, 100)

	return &TestResult{
		Name:        name,
		Description: desc,
		Result:      result,
	}
}
