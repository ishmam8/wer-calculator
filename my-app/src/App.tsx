import { useState, useEffect } from 'react'
import './App.css'
import { fillGrid } from "./Grid.ts"
import { findAlignment } from './findAlignment.ts'


interface AlignmentResult {
    operations: {type: string, word: string}[]
    sub_num: number
    del_num: number
    insert_num: number
    wer: number
}

function App() {
  const [inputRefValue, setInputRefValue] = useState('')
  const [inputHypValue, setInputHypValue] = useState('')
  const [gridd, setGridd] = useState<number[][]>([])
  const [alignmentResult, setAlignmentResult] = useState<AlignmentResult>({
    operations: [],
    sub_num: 0,
    del_num: 0,
    insert_num: 0,
    wer: 0
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currStep, setCurrentStep] = useState(0)
  const hyp = inputHypValue.toLowerCase().split(' ')
  const ref = inputRefValue.toLowerCase().split(' ')

  const handleRunAlignment = () => {
    setIsPlaying(!isPlaying)
    if (currStep === 0 && !isPlaying) {
      setIsPlaying(true)
      
      const grid = fillGrid(hyp, ref)
      const result = findAlignment(hyp, ref, grid)
    
      setGridd(grid)
      setAlignmentResult(result)

    } else if (currStep > 0 && isPlaying) {
      setIsPlaying(false)
    } 
  }

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        if (currStep >= alignmentResult.operations.length) {
            setIsPlaying(false)
        }
        else {
          setCurrentStep((currStep) => currStep + 1)
        }
      }, 400)

      return () => clearInterval(interval)
    }
  }, [isPlaying, currStep])

  return (
    <>
      <div className="App">
        <h1>WER Calculator</h1>
        <div className="input-section" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            <label htmlFor="ref-input">Reference:</label>
            <input
              id="ref-input"
              type="text"
              value={inputRefValue}
              onChange={(e) => setInputRefValue(e.target.value)}
            />
            <label htmlFor="hyp-input">Hypothesis:</label>
            <input
              id="hyp-input"
              type="text"
              value={inputHypValue}
              onChange={(e) => setInputHypValue(e.target.value)}
            />
          </div>
        </div>
        <div className="controls-section">
          <button onClick={() => handleRunAlignment()} disabled={!inputRefValue || !inputHypValue}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={() => setCurrentStep(0)}>
            Reset
          </button>
        </div>
        <div className='Visualization'>
          <h3>Alignment Progress:</h3>
          <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
              <span style={{color: 'green'}}>● Match</span>
              <span style={{color: 'orange'}}>● Substitution</span>
              <span style={{color: 'red'}}>● Deletion</span>
              <span style={{color: 'pink'}}>● Insertion</span>
          </div>
          <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', marginBottom: '20px' }}>
              {alignmentResult.operations.slice(0, currStep).map((op, index) => (
              <span key={index} style={{padding: '2px', color: op.type === 'match' ? 'green' : op.type === 'sub' ? 'yellow' : op.type === 'del' ? 'red' : 'pink' }}>
                {op.word}
              </span>
              ))}
          </div>
        </div>
        <div className='Results'>
          {currStep >= alignmentResult.operations.length && alignmentResult.operations.length > 0 && (
            <div className='Results'>
                <h3>Alignment Results:</h3>
                <div className="stats-grid">
                  <p><strong>WER:</strong> {(alignmentResult.wer * 100).toFixed(2)}%</p>
                  <p>Substitutions: {alignmentResult.sub_num}</p>
                  <p>Deletions: {alignmentResult.del_num}</p>
                  <p>Insertions: {alignmentResult.insert_num}</p>
                  <p>Reference Words: {ref.length}</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
