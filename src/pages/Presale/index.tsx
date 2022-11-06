import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import styled from "styled-components/macro"
import { ButtonPrimary, ButtonLight } from "../../components/Button"
import { PageWrapper, PresaleWrapper } from "../../components/common/styleds"
import Input from "../../components/NumericalInput"
import { useNavBarFlag, NavBarVariant } from "../../featureFlags/flags/navBar"
import { useRedesignFlag, RedesignVariant } from "../../featureFlags/flags/redesign"
import { useToggleWalletModal } from "../../state/application/hooks"
import bnbLogo from '../../assets/svg/bnb-logo.svg'
import ethLogo from '../../assets/images/ethereum-logo.png'
import { LoaderLarge } from "../../components/Loader"
import { ethers } from 'ethers'
import { useAllTransactions, useTransactionAdder } from "../../state/transactions/hooks"
import { TransactionType } from "../../state/transactions/types"

const ArrowContainer = styled.div`
  display: block;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  width: 100%;
  height: 100%;
`

const CenterDiv = styled.div`
    display: flex;
    margin: auto;
    width: max-content;
    align-items: center;
`
const TextButtonWrap = styled.div`
    margin: auto;
    width: max-content;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
`

const TitleContainer = styled.h2`
    font-weight: bold;
    font-size: large;
    font-family: inherit;
    margin: auto;
`

const AmountSelectorWrapper = styled.div`
    display: flex;
    padding: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    width: auto;
    max-width: 320px;
    align-items: center;
    background: ${({ theme }) => theme.backgroundModuleNew};
    border-radius: 16px;
`

const BaseLogoContainer = styled.img`
    margin-right: 0.5rem;
`

const BalCenterDiv = styled.div`
    display: flex;
    margin: auto;
    padding: 0.5rem;
    align-items: center;
`

const LeftDiv = styled.div`
    margin-left: 0;
    margin-right: auto;
`

const RightDiv = styled.div`
    margin-right: 0;
    margin-left: auto;
`

export default function Presale() {
    const navBarFlag = useNavBarFlag()
    const navBarFlagEnabled = navBarFlag === NavBarVariant.Enabled
    const redesignFlag = useRedesignFlag()
    const redesignFlagEnabled = redesignFlag === RedesignVariant.Enabled
    const { account, chainId, provider } = useWeb3React()
    const toggleWalletModal = useToggleWalletModal()
    const addTx = useTransactionAdder()
    const allTx = useAllTransactions()
    const [baseAmount, setBaseAmount] = useState("")
    const [turbineAmount, setTurbineAmount] = useState("")
    const [baseCurrencyLogo, setBaseCurrencyLogo] = useState("")
    const [baseCurrencyName, setBaseCurrencyName] = useState("")
    const [baseCurrencyBal, setBaseCurrencyBal] = useState("")
    const [turbineBal, setTurbineBal] = useState("")
    const [loading, setLoading] = useState(true)

    const erc20Abi = require('../../abi/generic-erc20-abi.json');
    const preSaleAbi = require('../../abi/presale-abi.json');
    const arbitrumPresaleContract = '0x896B3FcAFC3c1D8B9849593AEc93A38dAa85109f';
    const arbitrumTurbine = '0x0831E940A1ffCD7a0ca158334F3aC0078ba7F2A4';
    const bnbPresaleContract = '0x7049d38ce7eF19C8F356b534b44cBc4E99A8e207';
    const bnbTurbine = '0x18D21a7B6e9e1eea765D5aC0BA3d3C4A95792f1d';
    let maxBal = ethers.utils.parseUnits('5000000', 18);
    const [sold, setSold] = useState("")
    const [unsold, setUnsold] = useState("")
    const [multiplier, setMultiplier] = useState(ethers.utils.parseUnits('0'))
    const [canBuy, setCanBuy] = useState(false)
    const [buyButton, setBuyButton] = useState("")

    useEffect(() => {
        if (chainId === 56) {
            setBaseCurrencyLogo(bnbLogo)
            setBaseCurrencyName("BNB")
            GetBNBPresale()
        } else if (chainId === 42161) {
            setBaseCurrencyLogo(ethLogo)
            setBaseCurrencyName("ETH")
            GetArbitrumPresale()
        } else {
            setBaseCurrencyLogo("")
            setBaseCurrencyName("")
            ClearPresaleData()
        }
        setLoading(false)
    }, [chainId, loading])

    useEffect(() => {
        if (chainId === 56) {
            GetBNBPresale()
        } else if (chainId === 42161) {
            GetArbitrumPresale()
        }
    }, [allTx])

    async function GetBNBPresale() {
        const turbineContract = new ethers.Contract(bnbTurbine, erc20Abi, provider)
        const presaleContract = new ethers.Contract(bnbPresaleContract, preSaleAbi, provider)
        let preSaleBal = await turbineContract.balanceOf(bnbPresaleContract)
        let mul = await presaleContract.tokenMul()
        const bal = await provider?.getBalance(account ? account : "")
        const balString = bal ? bal.toString() : ""
        setBaseCurrencyBal(ethers.utils.formatUnits(balString, 18))
        const turbineBal = await turbineContract.balanceOf(account)
        setTurbineBal(ethers.utils.formatUnits(turbineBal, 18))
        setMultiplier(mul)
        setSold("Sold: "+parseFloat(ethers.utils.formatEther(maxBal.sub(preSaleBal))).toLocaleString())
        setUnsold("Unsold: "+parseFloat(ethers.utils.formatEther(preSaleBal)).toLocaleString())
    }

    async function GetArbitrumPresale() {
        const turbineContract = new ethers.Contract(arbitrumTurbine, erc20Abi, provider)
        const presaleContract = new ethers.Contract(arbitrumPresaleContract, preSaleAbi, provider)
        let preSaleBal = await turbineContract.balanceOf(arbitrumPresaleContract)
        let mul = await presaleContract.tokenMul()
        const bal = await provider?.getBalance(account ? account : "")
        const balString = bal ? bal.toString() : ""
        setBaseCurrencyBal(ethers.utils.formatUnits(balString, 18))
        const turbineBal = await turbineContract.balanceOf(account)
        setTurbineBal(ethers.utils.formatUnits(turbineBal, 18))
        setMultiplier(mul)
        setSold("Sold: "+parseFloat(ethers.utils.formatEther(maxBal.sub(preSaleBal))).toLocaleString())
        setUnsold("Unsold: "+parseFloat(ethers.utils.formatEther(preSaleBal)).toLocaleString())
    }

    function ClearPresaleData() {
        setSold("")
        setUnsold("")
        setMultiplier(ethers.utils.parseUnits('0'))
        setBaseCurrencyBal("")
        setTurbineBal("")
        setBaseAmount("")
        setTurbineAmount("")
    }

    useEffect(() => {
        if (chainId === 56 || chainId === 42161) {
            if (baseAmount) {
                try {
                    setTurbineAmount(ethers.utils.formatUnits(ethers.utils.parseUnits(baseAmount, 18).mul(multiplier), 18))
                    if (ethers.utils.parseUnits(baseAmount).lte(ethers.utils.parseUnits(baseCurrencyBal)) && turbineAmount != '0.0') {
                        setCanBuy(true)
                        setBuyButton("Buy")
                    } else {
                        setCanBuy(false)
                        setBuyButton("Check Amount")
                    }
                } catch (error) {
                    setCanBuy(false)
                    setBuyButton("Check Amount")
                }
            } else {
                setCanBuy(false)
                setTurbineAmount('')
                setBuyButton("Enter Amount")
            }
        } else {
            setCanBuy(false)
            setTurbineAmount('')
            setBuyButton("Wrong Chain!")
        }
    }, [baseAmount, chainId, turbineAmount])

    async function ValidateBuy() {
        if (chainId === 56 || chainId === 42161) {
            if (baseAmount && turbineAmount != '0.0') {
                const signer = provider?.getSigner()
                const baseAmountString = ethers.utils.parseUnits(baseAmount, 18)
                if (chainId === 56 && canBuy) {
                    const presaleContract = new ethers.Contract(bnbPresaleContract, preSaleAbi, signer)
                    try {
                        const txHash = await presaleContract.buy({value: baseAmountString})
                        addTx(txHash, {
                            type: TransactionType.BUY,
                            buyer: account ? account : "",
                            amount: baseAmount,
                        })
                    } catch (error) {
                        console.log(error)
                    }
                } else if (chainId === 42161 && canBuy) {
                    const presaleContract = new ethers.Contract(arbitrumPresaleContract, preSaleAbi, signer)
                    try {
                        const txHash = await presaleContract.buy({value: baseAmountString})
                        addTx(txHash, {
                            type: TransactionType.BUY,
                            buyer: account ? account : "",
                            amount: baseAmount,
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
    } 

    if (loading) {
        return (
            <PageWrapper redesignFlag={redesignFlagEnabled} navBarFlag={navBarFlagEnabled}>
                <CenterDiv>
                    <LoaderLarge />
                </CenterDiv>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper redesignFlag={redesignFlagEnabled} navBarFlag={navBarFlagEnabled}>
            <PresaleWrapper id="mint-page" redesignFlag={redesignFlagEnabled}>
                <ArrowContainer>
                    <TextButtonWrap><TitleContainer>Sample Presale</TitleContainer></TextButtonWrap>
                    <CenterDiv>
                        <AmountSelectorWrapper>
                            <Input value={baseAmount} onUserInput={(val) => setBaseAmount(val)} placeholder="0.00" type="numeric" disabled={account ? false : true} />
                            <BaseLogoContainer src={baseCurrencyLogo} width={32} height={32} />
                            <>{baseCurrencyName}</>
                        </AmountSelectorWrapper>
                    </CenterDiv>
                    <BalCenterDiv>
                        <RightDiv>{baseCurrencyName} Balance: {baseCurrencyBal}</RightDiv>
                    </BalCenterDiv>
                    <CenterDiv>
                        <AmountSelectorWrapper>
                            <Input value={turbineAmount} onUserInput={(val) => setTurbineAmount(val)} placeholder="0.00" type="numeric" disabled={true} />
                            <>$TURBINE</>
                        </AmountSelectorWrapper>
                    </CenterDiv>
                    <BalCenterDiv>
                        <RightDiv>$TURBINE Balance: {turbineBal}</RightDiv>
                    </BalCenterDiv>
                    <TextButtonWrap />
                    <BalCenterDiv>
                        <LeftDiv>{sold}</LeftDiv>
                        <RightDiv>{unsold}</RightDiv>
                    </BalCenterDiv>
                    <TextButtonWrap />
                    {   account 
                        ?   canBuy 
                            ? <ButtonPrimary redesignFlag={true} onClick={ValidateBuy}>{buyButton}</ButtonPrimary>
                            : <ButtonLight redesignFlag={true}>{buyButton}</ButtonLight>
                        : <ButtonLight redesignFlag={true} onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
                    }
                    
                </ArrowContainer>
            </PresaleWrapper>
        </PageWrapper>
    )
}