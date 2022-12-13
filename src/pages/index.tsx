import type { ImageAPIResponse } from '../types/api.types';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '../components/Spinner';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const promptRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLSelectElement>(null);

  const requestImageGenerateAPI = () => {
    console.log(promptRef.current?.value, sizeRef.current?.value);

    if (!promptRef.current || !sizeRef.current) return;
    setIsLoading(true);
    setError(null);

    fetch('/api/images', {
      method: 'POST',
      body: JSON.stringify({
        prompt: promptRef.current.value,
        size: sizeRef.current.value,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json() as Promise<ImageAPIResponse>)
      .then((resJson) => (resJson.success ? setImageUrls(resJson.data) : setError(resJson.error)))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };
  return (
    <div>
      <header className='w-full py-6 bg-orange-200 flex items-center'>
        <div className='mx-auto text-xl font-medium'>
          Image Generator with
          <Link
            href='https://openai.com/'
            target='_blank'
            rel='noreferrer'
            className='ml-2 text-orange-700 hover:text-orange-600'
          >
            Open AI
          </Link>
        </div>
      </header>
      <main className='container mx-auto'>
        <section className='flex justify-center text-xl py-8'>
          <form className='flex flex-col gap-y-4 min-w-[20rem]'>
            <input
              ref={promptRef}
              type='text'
              name='prompt'
              placeholder='What should I draw?'
              className='px-4 py-1 border-b-2 border-orange-400 outline-orange-200 text-center'
            />
            <select name='size' className='text-center border py-1 rounded-lg' ref={sizeRef}>
              <option value='small'>Small</option>
              <option value='medium'>Medium</option>
              <option value='large'>Large</option>
            </select>
            <button
              type='button'
              className='bg-orange-400 rounded-lg py-1'
              disabled={isLoading}
              onClick={requestImageGenerateAPI}
            >
              Generate
            </button>
          </form>
        </section>
        <section className='md:py-8'>
          <div className='h-96 flex items-center justify-center p-4'>
            {isLoading ? (
              <Spinner />
            ) : error === null ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full'>
                {imageUrls.map((url, i) => (
                  <div key={i} className='relative aspect-square'>
                    <Image src={url} alt={promptRef.current?.value ?? 'Generated Image'} fill />
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center text-red-500'>{error}</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
