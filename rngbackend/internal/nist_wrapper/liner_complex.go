package nistwrapper

import "github.com/SomeSuperCoder/RandomNumberGenerator/nist80022"

func LinearComplexityTest(bitArray *nist80022.BitArray) *TestResult {
	const name = "Тест линейной сложности"
	const desc = "Определяет сложность алгоритма, который мог бы воспроизвести данную последовательность. Чем выше сложность, тем более случайной считается последовательность"

	_, result := nist80022.LinearComplexityTest(bitArray, 100)

	return &TestResult{
		Name:        name,
		Description: desc,
		Result:      result,
	}
}
