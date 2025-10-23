package nistwrapper

import "github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"

func RunsTest(bitArray *nist80022.BitArray) *TestResult {
	const name = "Проверка серий"
	const desc = "Проверяет, нет ли в последовательности подозрительно длинных цепочек из одних нулей или единиц подряд, что бывает в неслучайных данных"

	_, result := nist80022.RunsTest(bitArray)

	return &TestResult{
		Name:        name,
		Description: desc,
		Result:      result,
	}
}
